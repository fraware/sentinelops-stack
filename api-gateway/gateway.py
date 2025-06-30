# FastAPI + Ariadne GraphQL gateway

import asyncio, os, json, datetime as dt
from pathlib import Path
from fastapi import FastAPI
from ariadne import QueryType, make_executable_schema, graphql
from ariadne.asgi import GraphQL
import asyncpg, aiokafka, dotenv

dotenv.load_dotenv()

PG_URL   = os.getenv("PG_URL", "postgres://sentinel:sentinel@postgres/sentinel")
KAFKA    = os.getenv("KAFKA_BROKERS", "kafka:9092")
PROOF_TOPIC = os.getenv("PROOF_TOPIC", "sentinel.proofs")

SQL_CREATE = """
CREATE TABLE IF NOT EXISTS proofs (
  id SERIAL PRIMARY KEY,
  property_id TEXT,
  start_ts TIMESTAMPTZ,
  end_ts   TIMESTAMPTZ,
  verdict  TEXT,
  cert_hash TEXT,
  trace_hash TEXT
);
"""
type_defs = """
type Proof {
  id: ID!
  propertyId: String!
  startTs: String!
  endTs:   String!
  verdict: String!
  certHash: String!
  traceHash: String!
}

type Query {
  proofs(propertyId: String, from: String, to: String): [Proof!]!
}
"""

query = QueryType()

@query.field("proofs")
async def resolve_proofs(*_, propertyId=None, **range_):
    async with db_pool.acquire() as con:
        sql = "SELECT * FROM proofs WHERE 1=1"
        args = []
        if propertyId:
            sql += " AND property_id = $1"
            args.append(propertyId)
        if range_.get("from"):
            args.append(dt.datetime.fromisoformat(range_["from"]))
            sql += f" AND start_ts >= ${len(args)}"
        if range_.get("to"):
            args.append(dt.datetime.fromisoformat(range_["to"]))
            sql += f" AND end_ts <= ${len(args)}"
        rows = await con.fetch(sql, *args)
        return [
            dict(
              id=r["id"], propertyId=r["property_id"],
              startTs=r["start_ts"].isoformat(),
              endTs=r["end_ts"].isoformat(),
              verdict=r["verdict"], certHash=r["cert_hash"],
              traceHash=r["trace_hash"]
            )
            for r in rows
        ]

schema = make_executable_schema(type_defs, query)
app = FastAPI()
app.mount("/graphql", GraphQL(schema, debug=False))

# ---------- Background consumer ------------------------------------------
async def kafka_consumer():
    consumer = aiokafka.AIOKafkaConsumer(
        PROOF_TOPIC, bootstrap_servers=KAFKA, value_deserializer=lambda b: json.loads(b.decode()))
    await consumer.start()
    try:
        async for msg in consumer:
            p = msg.value
            async with db_pool.acquire() as con:
                await con.execute(
                    "INSERT INTO proofs(property_id,start_ts,end_ts,verdict,cert_hash,trace_hash)"
                    "VALUES($1,$2,$3,$4,$5,$6)",
                    p["property_id"],
                    dt.datetime.fromtimestamp(p["start_ts"]),
                    dt.datetime.fromtimestamp(p["end_ts"]),
                    p["verdict"],
                    p["cert_hash"],
                    p["trace_hash"])
    finally:
        await consumer.stop()

@app.on_event("startup")
async def startup():
    global db_pool
    db_pool = await asyncpg.create_pool(PG_URL)
    async with db_pool.acquire() as con:
        await con.execute(SQL_CREATE)
    asyncio.create_task(kafka_consumer())

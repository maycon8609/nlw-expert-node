import fastify from "fastify"
import cookie from '@fastify/cookie'
import { fastifyWebsocket } from "@fastify/websocket"

import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { voteOnPoll } from "./routes/vote-on-poll"
import { pollResults } from "./ws/poll-results"

const port = 3333

const app = fastify()

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: "onRequest"
})

app.register(fastifyWebsocket)

app.register(createPoll)
app.register(getPoll)
app.register(pollResults)
app.register(voteOnPoll)

app.listen({ port }).then(() => {
  console.log(`🚧 Server is running on port ${port} 🚧`)
})
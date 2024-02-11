import fastify from "fastify"
import cookie from '@fastify/cookie'

import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { voteOnPoll } from "./routes/vote-on-poll"

const port = 3333

const app = fastify()

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: "onRequest"
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.listen({ port }).then(() => {
  console.log(`🚧 Server is running on port ${port} 🚧`)
})
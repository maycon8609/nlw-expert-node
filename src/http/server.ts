import fastify from "fastify"

import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { voteOnPoll } from "./routes/vote-on-poll"

const port = 3333

const app = fastify()

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.listen({ port }).then(() => {
  console.log(`🚧 Server is running on port ${port} 🚧`)
})
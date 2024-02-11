import { FastifyInstance } from "fastify"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })
  
    const { pollId } = getPollParams.parse(request.params)
  
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!poll) {
      return reply.status(400).send({ message: 'Poll not found.' })
    }

    const redisResult = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const votes = redisResult.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = redisResult[index + 1]

        Object.assign(obj, { [line]: Number(score) })
      }

      return obj
    }, {} as Record<string, number>)

    const pollDataReturn = {
      id: poll.id,
      title: poll.title,
      options: poll.options.map(option => {
        return {
          id: option.id,
          title: option.title,
          score: (option.id in votes) ? votes[option.id] : 0
        }
      })
    }
  
    return reply.send({ poll: pollDataReturn })
  })
}
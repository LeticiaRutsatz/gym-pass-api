import fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Diego Fernandes',
    email: 'diego@rocketsaeet.com.br',
  },
})

export const app = fastify();
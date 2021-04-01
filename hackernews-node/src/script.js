const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  const newLink = await prisma.link.create({
      data: {
          description: 'Save big bucks!',
          url: 'save.org',
      }
  })
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
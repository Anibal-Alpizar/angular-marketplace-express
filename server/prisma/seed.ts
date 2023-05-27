import { PrismaClient } from "@prisma/client";
import { users } from "./seeds/users";
import { roles } from "./seeds/roles";
import { categories } from "./seeds/categories";
import { products } from "./seeds/products";
import { photos } from "./seeds/photos";
import { questions } from "./seeds/questions";
import { answers } from "./seeds/answers";
import { addresses } from "./seeds/addresses";
import { customers } from "./seeds/customers";
import { paymentMethods } from "./seeds/paymentMethods";
import { purchases } from "./seeds/purchases";
import { purchaseItems } from "./seeds/purchaseItems";
import { evaluations } from "./seeds/evaluations";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: roles,
  });

  await prisma.user.createMany({
    data: users,
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.product.createMany({
    data: products,
  });

  await prisma.photo.createMany({
    data: photos,
  });

  await prisma.question.createMany({
    data: questions,
  });

  await prisma.answer.createMany({
    data: answers,
  });

  await prisma.address.createMany({
    data: addresses,
  });

  await prisma.customer.createMany({
    data: customers,
  });

  await prisma.paymentMethod.createMany({
    data: paymentMethods,
  });

  await prisma.purchase.createMany({
    data: purchases,
  });

  await prisma.purchaseItem.createMany({
    data: purchaseItems,
  });

  await prisma.evaluation.createMany({
    data: evaluations,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

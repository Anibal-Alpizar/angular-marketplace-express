import { PrismaClient } from "@prisma/client";
import { users } from "./seeds/users";
import { roles } from "./seeds/roles";
import { categories } from "./seeds/categories";
import { products } from "./seeds/products";
import { photos } from "./seeds/photos";
import { questions } from "./seeds/questions";
import { answers } from "./seeds/answers";
import { addresses } from "./seeds/addresses";
import { paymentMethods } from "./seeds/paymentMethods";
import { purchases } from "./seeds/purchases";
import { purchaseItems } from "./seeds/purchaseItems";
import { evaluations } from "./seeds/evaluations";
import { userRoles } from "./seeds/userRol";
import {
  Role,
  User,
  Category,
  Product,
  Photo,
  Question,
  Answer,
  Address,
  PaymentMethod,
  Purchase,
  PurchaseItem,
  Evaluation,
  UserRole,
} from "./types";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: roles as Role[],
  });

  await prisma.user.createMany({
    data: users as User[],
  });

  await prisma.userRole.createMany({
    data: userRoles as UserRole[],
  });

  await prisma.category.createMany({
    data: categories as Category[],
  });

  await prisma.product.createMany({
    data: products as Product[],
  });

  await prisma.photo.createMany({
    data: photos as Photo[],
  });

  await prisma.question.createMany({
    data: questions as Question[],
  });

  await prisma.answer.createMany({
    data: answers as Answer[],
  });

  await prisma.address.createMany({
    data: addresses as Address[],
  });

  await prisma.paymentMethod.createMany({
    data: paymentMethods as PaymentMethod[],
  });

  await prisma.purchase.createMany({
    data: purchases as Purchase[],
  });

  await prisma.purchaseItem.createMany({
    data: purchaseItems as PurchaseItem[],
  });

  await prisma.evaluation.createMany({
    data: evaluations as Evaluation[],
  });
}

main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect();
  })
  .catch(async (e: Error): Promise<void> => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

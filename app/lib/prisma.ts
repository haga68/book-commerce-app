import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};
//シングルトン
//グローバルオブジェクトを使用すると
//ホットリロードしても、一回だけのインスタンス化ですむ
//生成されたときだけ、インスタンス化

//インスタンス化されていないときだけ、prismaをインスタンス化
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
prisma = globalForPrisma.prisma;

export default prisma;
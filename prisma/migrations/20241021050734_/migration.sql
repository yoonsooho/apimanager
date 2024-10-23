-- CreateTable
CREATE TABLE "RowData" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "queryString" TEXT NOT NULL,
    "request" JSONB NOT NULL,
    "response" JSONB NOT NULL,
    "memo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RowData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RowData" ADD CONSTRAINT "RowData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

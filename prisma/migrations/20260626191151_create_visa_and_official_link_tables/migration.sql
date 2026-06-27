-- AlterTable
ALTER TABLE "roadmap_steps" ADD COLUMN     "visa_id" UUID;

-- CreateTable
CREATE TABLE "visas" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "documents" TEXT[],
    "financial_requirement" TEXT,
    "official_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "official_links" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "official_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "roadmap_steps" ADD CONSTRAINT "roadmap_steps_visa_id_fkey" FOREIGN KEY ("visa_id") REFERENCES "visas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visas" ADD CONSTRAINT "visas_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "official_links" ADD CONSTRAINT "official_links_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

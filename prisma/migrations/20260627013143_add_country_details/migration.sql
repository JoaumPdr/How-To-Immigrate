-- CreateTable
CREATE TABLE "country_details" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "overview" TEXT NOT NULL,
    "overview_en" TEXT NOT NULL,
    "costOfLiving" TEXT NOT NULL,
    "cost_of_living_en" TEXT NOT NULL,
    "jobMarket" TEXT NOT NULL,
    "job_market_en" TEXT NOT NULL,
    "healthcare" TEXT NOT NULL,
    "healthcare_en" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "education_en" TEXT NOT NULL,
    "housing" TEXT NOT NULL,
    "housing_en" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_details_country_id_key" ON "country_details"("country_id");

-- AddForeignKey
ALTER TABLE "country_details" ADD CONSTRAINT "country_details_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

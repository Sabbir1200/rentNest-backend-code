
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // Password
  // =========================

  const password = await bcrypt.hash("password123", 10);

  // =========================
  // Users
  // =========================

  const tenant1 = await prisma.user.upsert({
    where: {
      email: "tenant1@gmail.com",
    },
    update: {},
    create: {
      name: "Tenant One",
      email: "tenant1@gmail.com",
      password,
      phone: "01711111111",
      role: "TENANT",
    },
  });

  const tenant2 = await prisma.user.upsert({
    where: {
      email: "tenant2@gmail.com",
    },
    update: {},
    create: {
      name: "Tenant Two",
      email: "tenant2@gmail.com",
      password,
      phone: "01722222222",
      role: "TENANT",
    },
  });

  const landlord1 = await prisma.user.upsert({
    where: {
      email: "landlord1@gmail.com",
    },
    update: {},
    create: {
      name: "Landlord One",
      email: "landlord1@gmail.com",
      password,
      phone: "01733333333",
      role: "LANDLORD",
    },
  });

  const landlord2 = await prisma.user.upsert({
    where: {
      email: "landlord2@gmail.com",
    },
    update: {},
    create: {
      name: "Landlord Two",
      email: "landlord2@gmail.com",
      password,
      phone: "01744444444",
      role: "LANDLORD",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password,
      phone: "01755555555",
      role: "ADMIN",
    },
  });

  console.log("✅ Users created successfully!");

  // =========================
  // Categories
  // =========================

  const apartment = await prisma.category.upsert({
    where: {
      slug: "apartment",
    },
    update: {},
    create: {
      name: "Apartment",
      slug: "apartment",
      description: "Modern apartments available for rent.",
    },
  });

  const house = await prisma.category.upsert({
    where: {
      slug: "house",
    },
    update: {},
    create: {
      name: "House",
      slug: "house",
      description:
        "Houses available for family and residential rental.",
    },
  });

  const room = await prisma.category.upsert({
    where: {
      slug: "room",
    },
    update: {},
    create: {
      name: "Room",
      slug: "room",
      description: "Individual rooms available for rent.",
    },
  });

  const studio = await prisma.category.upsert({
    where: {
      slug: "studio",
    },
    update: {},
    create: {
      name: "Studio",
      slug: "studio",
      description:
        "Compact studio apartments suitable for individuals or couples.",
    },
  });

  const office = await prisma.category.upsert({
    where: {
      slug: "office",
    },
    update: {},
    create: {
      name: "Office",
      slug: "office",
      description: "Commercial office spaces available for rent.",
    },
  });

  console.log("✅ Categories created successfully!");

  // =========================
  // Properties
  // =========================

  const property1 = await prisma.property.create({
    data: {
      landlordId: landlord1.id,
      categoryId: apartment.id,
      title: "Modern 2 Bedroom Apartment",
      description:
        "A beautiful and modern 2 bedroom apartment suitable for a small family.",
      address: "Sonadanga Residential Area",
      city: "Khulna",
      rentAmount: 18000,
      isAvailable: true,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      landlordId: landlord1.id,
      categoryId: house.id,
      title: "Spacious Family House",
      description:
        "A spacious family house with multiple bedrooms and a comfortable living area.",
      address: "Nirala Residential Area",
      city: "Khulna",
      rentAmount: 25000,
      isAvailable: true,
    },
  });

  const property3 = await prisma.property.create({
    data: {
      landlordId: landlord1.id,
      categoryId: studio.id,
      title: "Premium Studio Apartment",
      description:
        "A compact and comfortable studio apartment for individuals or couples.",
      address: "Moylapota",
      city: "Khulna",
      rentAmount: 12000,
      isAvailable: true,
    },
  });

  await prisma.property.create({
    data: {
      landlordId: landlord2.id,
      categoryId: apartment.id,
      title: "Luxury 3 Bedroom Apartment",
      description:
        "A luxury 3 bedroom apartment with modern facilities and excellent surroundings.",
      address: "Khalishpur",
      city: "Khulna",
      rentAmount: 30000,
      isAvailable: true,
    },
  });

  await prisma.property.create({
    data: {
      landlordId: landlord2.id,
      categoryId: house.id,
      title: "Large Residential House",
      description:
        "A large residential house suitable for a medium-sized family.",
      address: "Boyra Residential Area",
      city: "Khulna",
      rentAmount: 22000,
      isAvailable: true,
    },
  });

  await prisma.property.create({
    data: {
      landlordId: landlord2.id,
      categoryId: room.id,
      title: "Single Furnished Room",
      description:
        "A fully furnished single room suitable for students and working professionals.",
      address: "Gollamari",
      city: "Khulna",
      rentAmount: 7000,
      isAvailable: true,
    },
  });

  await prisma.property.create({
    data: {
      landlordId: landlord2.id,
      categoryId: office.id,
      title: "Commercial Office Space",
      description:
        "A suitable commercial office space for startups and small businesses.",
      address: "KDA Avenue",
      city: "Khulna",
      rentAmount: 35000,
      isAvailable: true,
    },
  });

  console.log("✅ Properties created successfully!");

  // =========================
  // Rental Requests
  // =========================

  const rentalRequest1 = await prisma.rentalRequest.create({
    data: {
      tenantId: tenant1.id,
      propertyId: property1.id,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-12-31"),
      totalAmount: 54000,
      status: "ACTIVE",
      message:
        "I am interested in renting this apartment.",
    },
  });

  const rentalRequest2 = await prisma.rentalRequest.create({
    data: {
      tenantId: tenant2.id,
      propertyId: property2.id,
      startDate: new Date("2026-10-05"),
      endDate: new Date("2027-01-04"),
      totalAmount: 75000,
      status: "ACTIVE",
      message:
        "I would like to rent this house for my family.",
    },
  });

  const rentalRequest3 = await prisma.rentalRequest.create({
    data: {
      tenantId: tenant1.id,
      propertyId: property3.id,
      startDate: new Date("2026-11-01"),
      endDate: new Date("2027-01-31"),
      totalAmount: 90000,
      status: "PENDING",
      message:
        "I would like to rent this apartment for three months.",
    },
  });

  console.log("✅ Rental requests created successfully!");

  // =========================
  // Payments
  // =========================

  await prisma.payment.createMany({
    data: [
      {
        rentalRequestId: rentalRequest1.id,
        tenantId: tenant1.id,
        amount: 54000,
        currency: "BDT",
        provider: "SSLCOMMERZ",
        transactionId: "TXN-SSLCOM-100001",
        status: "COMPLETED",
        paidAt: new Date("2026-09-28T10:30:00"),
      },
      {
        rentalRequestId: rentalRequest2.id,
        tenantId: tenant2.id,
        amount: 75000,
        currency: "BDT",
        provider: "STRIPE",
        transactionId: "TXN-STRIPE-100002",
        status: "COMPLETED",
        paidAt: new Date("2026-09-29T14:45:00"),
      },
    ],
  });

  console.log("✅ Completed payments created successfully!");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


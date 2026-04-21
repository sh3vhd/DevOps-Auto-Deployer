/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: require('path').resolve(process.cwd(), '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Neon Wearables', slug: 'neon-wearables' },
      { name: 'Cyber Accessories', slug: 'cyber-accessories' },
      { name: 'Tech Decor', slug: 'tech-decor' },
      { name: 'Synth Audio', slug: 'synth-audio' }
    ]
  });
  console.log(`Created ${categories.count} categories`);

  const allCategories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(allCategories.map((cat) => [cat.slug, cat]));

  const productData = [
    {
      name: 'Aurora Pulse Headphones',
      slug: 'aurora-pulse-headphones',
      description: 'Immersive neon-lit wireless headphones with adaptive EQ and noise cancelation.',
      price: 199.99,
      stock: 25,
      images: ['https://picsum.photos/seed/headphones/640/480'],
      categoryId: categoryMap['synth-audio'].id
    },
    {
      name: 'Spectra Flux Smartwatch',
      slug: 'spectra-flux-smartwatch',
      description: 'Holographic interface smartwatch with biometric monitoring and neon glow bezel.',
      price: 249.5,
      stock: 30,
      images: ['https://picsum.photos/seed/smartwatch/640/480'],
      categoryId: categoryMap['neon-wearables'].id
    },
    {
      name: 'LumenTrail Sneakers',
      slug: 'lumentrail-sneakers',
      description: 'Responsive cushioning sneakers with programmable LED patterns and AR fit guidance.',
      price: 179.0,
      stock: 40,
      images: ['https://picsum.photos/seed/sneakers/640/480'],
      categoryId: categoryMap['neon-wearables'].id
    },
    {
      name: 'PulseGrid Backpack',
      slug: 'pulsegrid-backpack',
      description: 'Modular backpack with wireless charging pads and luminous fiber accents.',
      price: 149.99,
      stock: 22,
      images: ['https://picsum.photos/seed/backpack/640/480'],
      categoryId: categoryMap['cyber-accessories'].id
    },
    {
      name: 'Neoverse Desk Mat',
      slug: 'neoverse-desk-mat',
      description: 'Glassmorphism-inspired desk mat with ambient edge lighting and wireless charging.',
      price: 89.5,
      stock: 55,
      images: ['https://picsum.photos/seed/deskmatt/640/480'],
      categoryId: categoryMap['tech-decor'].id
    },
    {
      name: 'HoloWave Speaker',
      slug: 'holowave-speaker',
      description: '360° spatial audio speaker with holographic equalizer projections.',
      price: 219.0,
      stock: 28,
      images: ['https://picsum.photos/seed/speaker/640/480'],
      categoryId: categoryMap['synth-audio'].id
    },
    {
      name: 'FluxCharge Dock',
      slug: 'fluxcharge-dock',
      description: 'Multi-device magnetic charging dock with animated neon indicator ring.',
      price: 119.99,
      stock: 35,
      images: ['https://picsum.photos/seed/dock/640/480'],
      categoryId: categoryMap['cyber-accessories'].id
    },
    {
      name: 'Nebula Shade Lamp',
      slug: 'nebula-shade-lamp',
      description: 'Smart lamp with dynamic nebula lighting modes and ambient sensors.',
      price: 134.75,
      stock: 18,
      images: ['https://picsum.photos/seed/lamp/640/480'],
      categoryId: categoryMap['tech-decor'].id
    },
    {
      name: 'CipherGuard Wallet',
      slug: 'cipherguard-wallet',
      description: 'RFID-blocking wallet with biometric lock and subtle neon stitching.',
      price: 69.99,
      stock: 60,
      images: ['https://picsum.photos/seed/wallet/640/480'],
      categoryId: categoryMap['cyber-accessories'].id
    },
    {
      name: 'PrismArc Wall Art',
      slug: 'prismarc-wall-art',
      description: 'Interactive LED wall panel reacting to music and motion for a futuristic vibe.',
      price: 259.99,
      stock: 12,
      images: ['https://picsum.photos/seed/art/640/480'],
      categoryId: categoryMap['tech-decor'].id
    },
    {
      name: 'NeonFrame Glasses',
      slug: 'neonframe-glasses',
      description: 'Augmented reality glasses with adaptive tinting and neon edge lighting.',
      price: 329.0,
      stock: 15,
      images: ['https://picsum.photos/seed/glasses/640/480'],
      categoryId: categoryMap['neon-wearables'].id
    },
    {
      name: 'SynthPulse Mixer',
      slug: 'synthpulse-mixer',
      description: 'Compact DJ mixer with touch-sensitive controls and reactive neon feedback.',
      price: 289.5,
      stock: 14,
      images: ['https://picsum.photos/seed/mixer/640/480'],
      categoryId: categoryMap['synth-audio'].id
    }
  ];

  for (const product of productData) {
    await prisma.product.create({ data: product });
  }

  console.log(`Inserted ${productData.length} products`);

  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const defaultPassword = process.env.DEFAULT_PASSWORD || 'Password123!';

  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN'
    }
  });

  const userOne = await prisma.user.create({
    data: {
      email: process.env.TEST_USER_ONE_EMAIL || 'jane@example.com',
      passwordHash: await bcrypt.hash(defaultPassword, 10),
      role: 'USER'
    }
  });

  const userTwo = await prisma.user.create({
    data: {
      email: process.env.TEST_USER_TWO_EMAIL || 'john@example.com',
      passwordHash: await bcrypt.hash(defaultPassword, 10),
      role: 'USER'
    }
  });

  const products = await prisma.product.findMany({ take: 3 });

  await prisma.order.create({
    data: {
      userId: userOne.id,
      total: products.reduce((acc, product) => acc + Number(product.price), 0),
      status: 'PAID',
      shippingAddress: {
        fullName: 'Jane Neon',
        street: '123 Future Ave',
        city: 'Neotopia',
        state: 'CA',
        postalCode: '90001',
        country: 'USA'
      },
      items: {
        create: products.map((product) => ({
          productId: product.id,
          quantity: 1,
          priceAtPurchase: product.price
        }))
      }
    }
  });

  await prisma.order.create({
    data: {
      userId: userTwo.id,
      total: Number(products[0].price) * 2,
      status: 'SHIPPED',
      shippingAddress: {
        fullName: 'John Flux',
        street: '789 Hyperion Blvd',
        city: 'Cyber City',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            priceAtPurchase: products[0].price
          }
        ]
      }
    }
  });

  console.log('✅ Seed completed');
  console.log('Admin credentials:', admin.email, adminPassword);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

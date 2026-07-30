# ========== ETAPA 1: la cocina (construir) ==========
FROM node:24-slim AS build
RUN npm install -g pnpm@11
WORKDIR /app

# Copiamos todo e instalamos TODO (incluidas herramientas de construir)
COPY . .
RUN pnpm install --frozen-lockfile

# Generamos el cliente de Prisma (URL falsa: generate no se conecta)
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN pnpm --filter @probli/api exec prisma generate

# ========== ETAPA 2: el plato (servir) ==========
FROM node:24-slim AS runner
RUN npm install -g pnpm@11
WORKDIR /app
ENV NODE_ENV=production

# Solo los manifiestos y el candado de versiones
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Instalamos SOLO las dependencias de producción de la api
RUN pnpm install --prod --frozen-lockfile

# Traemos de la cocina el código + el cliente de Prisma ya generado
COPY --from=build /app/apps/api/src ./apps/api/src
COPY --from=build /app/packages/shared/src ./packages/shared/src

WORKDIR /app/apps/api
EXPOSE 3000
CMD ["pnpm", "start"]
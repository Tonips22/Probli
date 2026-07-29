# Partimos de una imagen oficial de Node ligera
FROM node:24-slim AS base
# Instalamos pnpm dentro de la imagen
RUN npm install -g pnpm@11
WORKDIR /app

# Copiamos todo el proyecto (respetando el .dockerignore)
COPY . .

# Instalamos las dependencias de todo el monorepo
RUN pnpm install --frozen-lockfile

# Generamos el cliente de Prisma.
# Le damos una URL falsa: "generate" solo lee el schema, no se conecta a nada.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN pnpm --filter @probli/api exec prisma generate

# A partir de aquí, modo producción
ENV NODE_ENV=production

# Avisamos de que la app escucha en el puerto 4321
EXPOSE 4321

# El comando que arranca el servidor cuando la caja se enciende
CMD ["pnpm", "--filter", "@probli/api", "start"]
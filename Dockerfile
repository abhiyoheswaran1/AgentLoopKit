FROM node:24-alpine AS build

WORKDIR /src

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

COPY package.json pnpm-lock.yaml tsconfig.json tsup.config.ts ./
COPY schema ./schema
COPY scripts ./scripts
COPY src ./src
COPY README.md LICENSE ./

RUN pnpm install --frozen-lockfile && pnpm build && npm pack --pack-destination /tmp

FROM node:24-alpine

COPY --from=build /tmp/agentloopkit-*.tgz /tmp/

RUN npm install -g /tmp/agentloopkit-*.tgz \
  && rm /tmp/agentloopkit-*.tgz \
  && npm cache clean --force

WORKDIR /workspace

ENTRYPOINT ["agentloop"]
CMD ["version"]

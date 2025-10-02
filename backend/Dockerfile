###################################################
# Secure Dockerfile with Supply Chain Attestations
# 
# This Dockerfile addresses Docker Scout security findings:
# - Creates non-root user for security
# - Uses better-sqlite3 (no Python compilation needed)
# - Implements security best practices with SBOM and provenance
# - Based on working original Dockerfile with security improvements
###################################################

FROM node:22 AS base
WORKDIR /usr/local/app

# Install dumb-init and create non-root user
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -g 1001 -r nodejs \
    && useradd -r -g nodejs -u 1001 nextjs

################## CLIENT STAGES ##################

FROM base AS client-base
COPY client/package.json client/package-lock.json ./
RUN npm ci && npm cache clean --force
COPY client/.eslintrc.cjs client/index.html client/vite.config.js ./
COPY client/public ./public
COPY client/src ./src

FROM client-base AS client-build
RUN npm run build

################## BACKEND STAGES ##################

FROM base AS backend-base
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY backend/src ./src

################## FINAL STAGE ##################

FROM base AS final
ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code
COPY backend/src ./src
COPY --from=client-build /usr/local/app/dist ./src/static

# Create necessary directories and set permissions
RUN mkdir -p /usr/local/app/logs && \
    chown -R nextjs:nodejs /usr/local/app

# Switch to non-root user
USER nextjs

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

EXPOSE 3000
CMD ["node", "src/index.js"]

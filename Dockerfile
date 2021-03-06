# Copyright (C) 2020 Aayla Fetzer
# 
# This file is part of FileIndex.
# 
# FileIndex is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# FileIndex is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with FileIndex.  If not, see <http://www.gnu.org/licenses/>.

FROM node:slim

ENV NODE_ENV=production

WORKDIR /app

## Copy package.json and package-lock.json before copy other files for better build caching
COPY ["./package.json", "./package-lock.json", "/app/"]
COPY "./" "/app/"
RUN npm install

CMD ["npm", "start"]

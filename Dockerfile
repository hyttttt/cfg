FROM gradle:jdk17 AS base

ENV PATH=$PATH:/usr/local/go/bin
RUN apt-get update \
    && apt-get install -y python3-pip python-is-python3

FROM base
RUN wget "https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_10.2.3_build/ghidra_10.2.3_PUBLIC_20230208.zip" -O ghidra.zip \
    && unzip ghidra.zip \
    && wget "https://github.com/mandiant/Ghidrathon/archive/refs/tags/v2.0.1.zip" \
    && unzip v2.0.1.zip \
    && cd "Ghidrathon-2.0.1/" \
    && gradle --no-daemon -PGHIDRA_INSTALL_DIR="/home/gradle/ghidra_10.2.3_PUBLIC" \
    && cd "/home/gradle/ghidra_10.2.3_PUBLIC/Ghidra/Extensions" \
    && unzip "/home/gradle/Ghidrathon-2.0.1/dist/ghidra_10.2.3_PUBLIC_$(date '+%Y%m%d')_Ghidrathon-2.0.1" \
    && cd "/home/gradle/" \
    && wget "https://go.dev/dl/go1.20.2.linux-amd64.tar.gz" \
    && tar -C /usr/local -xzf go1.20.2.linux-amd64.tar.gz
COPY . ./src
WORKDIR ./src
RUN pip3 install -r requirements.txt \
    && go build ./main.go
ENTRYPOINT ["./main"]
EXPOSE 8000
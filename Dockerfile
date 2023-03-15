FROM gradle:jdk17

COPY api ./src
RUN apt-get update \
    && apt-get install -y python3-pip python-is-python3 \
    && pip3 install -r ./src/requirements.txt \
    && wget "https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_10.2.3_build/ghidra_10.2.3_PUBLIC_20230208.zip" -O ghidra.zip \
    && unzip ghidra.zip \
    && wget "https://github.com/mandiant/Ghidrathon/archive/refs/tags/v2.0.1.zip" \
    && unzip v2.0.1.zip \
    && cd "Ghidrathon-2.0.1/" \
    && gradle -PGHIDRA_INSTALL_DIR="/home/gradle/ghidra_10.2.3_PUBLIC" \
    && cd "/home/gradle/ghidra_10.2.3_PUBLIC/Ghidra/Extensions" \
    && unzip "/home/gradle/Ghidrathon-2.0.1/dist/ghidra_10.2.3_PUBLIC_20230315_Ghidrathon-2.0.1.zip" \
    && cd "/home/gradle/ghidra_10.2.3_PUBLIC/support/" \
# 基础镜像，可以先执行 docker pull eclipse-temurin:17-jre
FROM eclipse-temurin:17-jre

# 配置
ENV PARAMS=""

# 时区
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 添加应用
ADD target/mindshell-server-app.jar /mindshell-server-app.jar

ENTRYPOINT ["sh","-c","java -jar $JAVA_OPTS /mindshell-server-app.jar $PARAMS"]
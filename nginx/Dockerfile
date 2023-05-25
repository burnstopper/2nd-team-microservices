ARG USER_PORT
ARG QUESTIONNAIRE_PORT
ARG QUIZ_PORT

FROM nginx:1.23-alpine-slim
ENV USER_PORT $USER_PORT
ENV QUESTIONNAIRE_PORT $QUESTIONNAIRE_PORT
ENV QUIZ_PORT $QUIZ_PORT
RUN rm /etc/nginx/conf.d/default.conf
COPY ./*.conf.template /etc/nginx/templates/
EXPOSE $USER_PORT $QUESTIONNAIRE_PORT $QUIZ_PORT
CMD ["nginx", "-g", "daemon off;"]
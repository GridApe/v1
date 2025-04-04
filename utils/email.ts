export const emailTemplate = {
  "counters": {
    "u_column": 3,
    "u_row": 3,
    "u_content_button": 1,
    "u_content_heading": 1,
    "u_content_text": 2,
    "u_content_image": 1
},
"body": {
  "rows": [
      {
          "id": "header",
          "cells": [
              1
          ],
          "columns": [
              {
                  "id": "header-column",
                  "contents": [
                      {
                          "type": "image",
                          "values": {
                              "src": {
                                  "url": "https://i.imgur.com/n5SiSAP.png",
                                  "width": 200,
                                  "height": 50
                              },
                              "textAlign": "center",
                              "containerPadding": "10px"
                          }
                      }
                  ],
                  "values": {
                      "backgroundColor": "#ffffff",
                      "padding": "20px",
                      "border": {},
                      "borderRadius": "0px"
                  }
              }
          ],
          "values": {}
      },
      {
          "id": "main-content",
          "cells": [
              1
          ],
          "columns": [
              {
                  "id": "content-column",
                  "contents": [
                      {
                          "type": "heading",
                          "values": {
                              "text": "Introducing Our New AI-Powered Productivity App!",
                              "textAlign": "left",
                              "lineHeight": "140%",
                              "fontSize": "28px",
                              "fontFamily": {
                                  "label": "Arial",
                                  "value": "arial,helvetica,sans-serif"
                              }
                          }
                      },
                      {
                          "type": "text",
                          "values": {
                              "text": "We are excited to announce the launch of our innovative AI-powered productivity app designed specifically for busy professionals like you. Our app leverages advanced artificial intelligence to help you manage your time more effectively, streamline your tasks, and increase your overall workplace efficiency. With features like smart scheduling, task prioritization, and real-time collaboration tools, you can focus on what really matters and get more done in less time.",
                              "textAlign": "left",
                              "lineHeight": "140%",
                              "fontSize": "16px",
                              "fontFamily": {
                                  "label": "Arial",
                                  "value": "arial,helvetica,sans-serif"
                              }
                          }
                      },
                      {
                          "type": "button",
                          "values": {
                              "text": "Get Started Now",
                              "textAlign": "center",
                              "buttonColors": {
                                  "color": "#ffffff",
                                  "backgroundColor": "#4A90E2",
                                  "hoverColor": "#ffffff",
                                  "hoverBackgroundColor": "#357ABD"
                              },
                              "href": {
                                  "name": "web",
                                  "values": {
                                      "href": "https://example.com",
                                      "target": "_blank"
                                  }
                              }
                          }
                      }
                  ],
                  "values": {
                      "backgroundColor": "#ffffff",
                      "padding": "20px 30px",
                      "border": {},
                      "borderRadius": "0px"
                  }
              }
          ],
          "values": {
              "backgroundColor": "#ffffff",
              "padding": "20px 30px",
              "border": {},
              "borderRadius": "0px"
          }
      },
      {
          "id": "footer",
          "cells": [
              1
          ],
          "columns": [
              {
                  "id": "footer-column",
                  "contents": [
                      {
                          "type": "text",
                          "values": {
                              "text": "© 2023 Tech Startup Inc. All rights reserved. This email was sent to you because you opted in at our website. If you wish to unsubscribe, click here.",
                              "textAlign": "center",
                              "lineHeight": "120%",
                              "fontSize": "12px",
                              "fontFamily": {
                                  "label": "Arial",
                                  "value": "arial,helvetica,sans-serif"
                              }
                          }
                      }
                  ],
                  "values": {
                      "backgroundColor": "#f8f9fa",
                      "padding": "20px",
                      "border": {},
                      "borderRadius": "0px"
                  }
              }
          ],
          "values": {}
      }
  ],
  "values": {
      "backgroundColor": "#ffffff",
      "width": "600px",
      "padding": "0px"
  }
},
  "schemaVersion": 12
}
  
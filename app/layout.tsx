"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Notification from "@components/Notification";
import AuthSession from "./components/AuthSession";
import React from "react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "live_ankit",
  description: "LiveWithCodeAnkit",
};

const initBotpress = () => {
  window.botpressWebChat.init({
    composerPlaceholder: "Chat with liveAnkit",
    botConversationDescription: "welcome to liveankit.com",
    botId: "7eabcabf-6ee1-4830-9637-8e5b460a2e24",
    hostUrl: "https://cdn.botpress.cloud/webchat/v1",
    messagingUrl: "https://messaging.botpress.cloud",
    clientId: "7eabcabf-6ee1-4830-9637-8e5b460a2e24",
    webhookId: "3d2459eb-be62-414a-8d1b-4a0e5f2095b9",
    lazySocket: true,
    themeName: "prism",
    botName: "liveAnkit",
    avatarUrl:
      "https://avatars.githubusercontent.com/u/122344948?s=400&u=86ddbfc2e55c86dbec55ac7ca2442d6ac8d676bd&v=4",
    stylesheet:
      "https://webchat-styler-css.botpress.app/prod/c0aedbb1-52b7-44c1-adea-683e4a89ff2e/v83966/style.css",
    frontendVersion: "v1",
    useSessionStorage: true,
    showPoweredBy: false,
    theme: "prism",
    themeColor: "#2563eb",
  });
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSession>
      <html lang="en">
        <head>
          <Script
            src="https://cdn.botpress.cloud/webchat/v0/inject.js"
            onLoad={() => {
              initBotpress();
            }}
          />
        </head>
        <body className={inter.className}>
          {children}
          <Notification />
        </body>
      </html>
    </AuthSession>
  );
}

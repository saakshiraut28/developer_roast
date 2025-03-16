/** @format */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { Octokit } from "@octokit/core";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const octokit = new Octokit();

  const [username, setUsername] = useState<string>("");

  const [roast, setRoast] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!username) {
      alert("Enter your GitHub username first :(");
      return;
    }

    try {
      // Fetch user profile
      const { data: profile } = await octokit.request(`GET /users/${username}`);
      // Fetch repos
      const { data: repos } = await octokit.request(
        `GET /users/${username}/repos`,
        {
          per_page: 5,
        }
      );

      console.log("GitHub Data:", profile, repos);

      // Call the backend API
      const response = await fetch("/pages/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, profile, repos }),
      });

      const data = await response.json();
      if (response.ok) {
        setRoast(data.roast);
      } else {
        throw new Error(data.error || "Failed to fetch roast");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Couldn't fetch GitHub data. Did you spell it wrong?");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GithubIcon className="h-5 w-5" />
            <span>GitHub Analytics</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Features
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 py-20 md:py-32">
          <div className="mx-auto flex max-w-[800px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Analyze GitHub Profiles
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Enter a GitHub username to view detailed analytics and insights
              about their repositories and activity.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="github-username" className="text-sm font-medium">
                GitHub Username
              </label>
              <Input
                id="github-username"
                placeholder="Enter GitHub username"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleAnalyze}>
              View Analytics
            </Button>
          </div>
        </section>
      </main>
      {roast && (
        <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg text-center shadow-lg">
          <h2 className="text-xl font-bold">🔥 Brutal Roast 🔥</h2>
          <p className="mt-2 italic">{roast}</p>
        </div>
      )}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GitHub Analytics. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

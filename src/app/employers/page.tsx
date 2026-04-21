import { Metadata } from "next";
import { getDirectoryEmployers } from "@/lib/employers";
import DirectoryClient from "./directory-client";

export const metadata: Metadata = {
  title: "Mental Health Employers Australia | Browse Companies Hiring Now",
  description: "Browse mental health employers across Australia. Find private practices, NDIS providers, government health services, and community NFPs hiring psychologists, counsellors, nurses, and support workers.",
  alternates: { canonical: "/employers" },
};

export const revalidate = 3600;

export default async function EmployerDirectoryPage() {
  const employers = await getDirectoryEmployers();
  return <DirectoryClient employers={employers} />;
}

import { Metadata } from "next";


export const metadata: Metadata = { title: "Wedding Gallery" };


export default ({children}: Readonly<{children: React.ReactNode;}>) => children;

import React from "react";
import Image from "next/image";

export default function Avatar(src) {
  return <Image src={() => import(src)} width={100} height={100} />;
}

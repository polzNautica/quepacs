import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default-old";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          {/* <span className={title()}>Make Test&nbsp;</span> */}
          <span className={title()}>Pengurusan Subkribsi</span>
          <br />
          <span className={title({ color: "blue" })}>
            Quepacs Kasih&nbsp;
          </span>
          <br />
          <div className={subtitle({ class: "mt-4" })}>
            Pengurusan dan semakan status subkribsi dalam talian.
          </div>
        </div>

        <div className="flex flex-col">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/register"
          >
            Daftar Sekarang
          </Link>
          <br />
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="/login"
          >
            Log Masuk
          </Link>
        </div>

        {/* <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div> */}
      </section>
    </DefaultLayout>
  );
}

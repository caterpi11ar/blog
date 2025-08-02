import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

export default (post: CollectionEntry<"blog">) => {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{
        background: "#fefbfb",
      }}
    >
      <div
        className="absolute flex justify-center"
        style={{
          top: "-1px",
          right: "-1px",
          border: "4px solid #000",
          background: "#ecebeb",
          opacity: "0.9",
          borderRadius: "4px",
          margin: "2.5rem",
          width: "88%",
          height: "80%",
        }}
      />

      <div
        className="flex justify-center"
        style={{
          border: "4px solid #000",
          background: "#fefbfb",
          borderRadius: "4px",
          margin: "2rem",
          width: "88%",
          height: "80%",
        }}
      >
        <div
          className="flex-col flex justify-between"
          style={{
            margin: "20px",
            width: "90%",
            height: "90%",
          }}
        >
          <p
            className="overflow-hidden font-bold"
            style={{
              fontSize: 72,
              maxHeight: "84%",
            }}
          >
            {post.data.title}
          </p>
          <div
            className="flex justify-between w-full mb-2"
            style={{
              fontSize: 28,
            }}
          >
            <span>
              by{" "}
              <span
                className="text-transparent"
              >
                "
              </span>
              <span className="overflow-hidden font-bold">
                {post.data.author}
              </span>
            </span>

            <span className="overflow-hidden font-bold">
              {SITE.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

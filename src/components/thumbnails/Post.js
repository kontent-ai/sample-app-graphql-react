import React from "react";
import get from "lodash.get";
import { Image, Link } from "..";
import { useTheme } from "@material-ui/core";

function Post(props) {
  let post = get(props, "item", null);
  let columnCount = get(props, "columnCount", 1);
  let postUrl = "/blog/" + get(post, "slug", "#");

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.md}px) ${Math.floor(100 / columnCount)}vw, 100vw`;
  const image = get(post, "image[0]", null);
  const title = get(post, "title", null);
  const excerpt = get(post, "excerpt", null);
  const publishingDate = get(post, "publishingDate", null);
  const author = get(post, "author.items[0]", null);
  return (
    <article>
      <div>
        {image && (
          <Link href={postUrl}>
            <Image
              sizes={imageSizes}
              asset={image}
              alt={image.description || image.name || null} />
          </Link>
        )}
        <div>
          <header>
            <h3><Link href={postUrl}>{title}</Link></h3>
          </header>
          <div>
            <p>{excerpt}</p>
          </div>
          <footer>
            <time>{publishingDate && new Date(publishingDate).toDateString()}</time>
            {author && `, by ${author.firstName} ${author.lastName}`}
          </footer>
        </div>
      </div>
    </article>
  );
}

export default Post;

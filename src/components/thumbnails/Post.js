import React from "react";
import get from "lodash.get";
import { Image, Link } from "..";
import { useTheme } from "@material-ui/core";

function Post(props) {
  let post = get(props, "item", null);
  let columnCount = get(props, "columnCount", 1);
  let postUrl = "/blog/" + get(post, "slug.value", "#");

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.md}px) ${Math.floor(100 / columnCount)}vw, 100vw`;
  const image = get(post, "image.value[0]", null);
  const title = get(post, "title.value", null);
  const excerpt = get(post, "excerpt.value", null);
  const publishingDate = get(post, "publishing_date.value", null);
  const author = get(post, "author.value[0]", null);
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
            {author && `, by ${author.first_name.value} ${author.last_name.value}`}
          </footer>
        </div>
      </div>
    </article>
  );
}

export default Post;

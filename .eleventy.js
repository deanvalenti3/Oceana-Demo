module.exports = function (eleventyConfig) {
  // Static assets live in site/ — copy to _site/ without processing
  eleventyConfig.addPassthroughCopy({ "site/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "site/script.js":  "script.js"  });
  eleventyConfig.addPassthroughCopy({ "site/assets":     "assets"     });
  eleventyConfig.addPassthroughCopy({ "site/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "site/sitemap.xml":"sitemap.xml"});
  eleventyConfig.addPassthroughCopy({ "netlify": "netlify" });

  return {
    dir: {
      input:    "src",
      output:   "_site",
      includes: "_includes",
      data:     "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"],
  };
};

export function formatReviewsCount(reviews: number) {
    if (reviews >= 1_000_000) {
      return `${(reviews / 1_000_000).toFixed(1)}M`.replace(/\.0$/, "M");
    } else if (reviews >= 1_000) {
      return `${(reviews / 1_000).toFixed(1)}k`.replace(/\.0$/, "k");
    } else {
      return reviews.toString();
    }
}
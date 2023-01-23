const DEFAULT_ITEMS_LIMIT = 0;
const DEFAULT_PAGE = 1;

function definePagination(query) {
  const limit = Math.abs(query.limit) || DEFAULT_ITEMS_LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  const skip = (page - 1) * limit;

  return { limit, skip };
}

module.exports = definePagination;

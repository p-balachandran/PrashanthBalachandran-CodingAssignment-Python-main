
## Recommendations

### 1. Optimization suggestions
- Increase number of application instances to handle more concurrent users.  
- Add caching for search results to reduce repeated load on the search controller.  

### 2. Infrastructure considerations
- Review current number of instances and enable horizontal scaling.  
- CPU and memory looked stable, so no vertical scaling needed.  
- Check search engine configuration and indexes to ensure queries are efficient.  

### 3. Risk and scalability insights
- Without scaling, response times will continue to rise with more users.  
- Search queries may become a bottleneck as data grows.  
- Relying only on instance count may delay issues if search is not optimized.  

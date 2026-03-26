/**
 * Used to query the osg GRACC accounting endpoint
 *
 * This endpoint uses Elasticsearch
 */

const ADSTASH_SUMMARY_INDEX: string = "ospool-summary-*"
const ADSTASH_ENDPOINT: string = "https://elastic.osg.chtc.io/q"

const DATE_RANGE: Record<string, number> = {
    oneYearAgo: new Date(new Date().setDate(new Date().getDate()-365)).getTime(), // Gets last years timestamp
    threeMonthsAgo: new Date(new Date().setDate(new Date().getDate()-90)).getTime(), // Gets date object 90 days in advance
    now: new Date().getTime(),
    yesterday: new Date(new Date().setDate(new Date().getDate()-1)).getTime(),
}



class ElasticSearchQuery {
    index: string;
    endpoint: string;

    constructor(index: string, endpoint: string) {
        this.index = index
        this.endpoint = endpoint
    }

    /**
     * Makes a request to the Elasticsearch API
     * @param url - The url to make the request too
     * @param body - The Object to be used as data
     * @param options - Additional Fetch request options
     * @returns Object - A JSON object
     */
    async make_request<T = unknown>(url: string, body: object = {}, options: object = {}): Promise<T> {

        let response = await Promise.race([
            fetch(url, {
                ...options,
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 15000))
        ])

        if( !response.ok ){
            console.error(await response.json())
            throw Error(`Invalid Response from ${url}`)
        }

        return await response.json()
    }

    /**
     * Helper for Elasticsearch searches
     *
     * @param body - The object representative of the search
     * @param options - Any additional fetch options
     * @returns Object - A JSON object
     */
    async search(body: object, options?: object) : Promise<unknown>{

        let url = `${this.endpoint}/${this.index}/_search`
        let method = "POST"

        return await this.make_request(url, body, {method:method, ...options})
    }
}

export { DATE_RANGE, ADSTASH_ENDPOINT, ADSTASH_SUMMARY_INDEX }
export default ElasticSearchQuery;
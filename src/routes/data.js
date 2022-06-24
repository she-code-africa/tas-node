import { cleanURL, invokeRunner } from "../utils";

export const handleSingle = async (req, res) => {
    const { url, language } = req.body;
    const response = await invokeRunner(cleanURL(url), language)
    res.status(200).json(response)
};

export const handleMultiple = async (req, res) => {
    const payload = req.body
    const promises = Object.keys(payload).map(async (index) => {
        const { url, language, fullName } = payload[index]
        let res = { url, language, index, fullName, score: 'URL invalid or language no supported' }
        console.log(url, language)
        try {
            if (url && language) {
                res.score = await invokeRunner(cleanURL(url), language)
                return res
            }
            return res
        } catch (e) {
            res.score = e
            return res
        }
    })

    const response = await Promise.allSettled(promises)
        .then((values) => {
            return values.map((v) => ({
                index: v.value.index,
                // fullName: v.value.fullName,
                score: v.status === 'fulfilled' ? v.value.score : v.reason
            }))
            /* const payload = values.reduce((acc, v) => {
                return {
                    ...acc,
                    [v.value.index]: {
                        score: v.status === 'fulfilled' ? v.value.score : v.reason
                    }
                }
            }, {})
            return res.status(200).json(payload) */
        })
        .catch((e) => {
            res.end(e)
        })
    return res.status(200).json(response)
}
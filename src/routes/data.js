import { invokeRunner } from "../utils";

export const handleSingle = async (req, res) => {
    const { url, language } = JSON.parse(req.body);

    const response = await invokeRunner(url, language)
    res.status(200).json(response)
};

export const handleMultiple = async (req, res) => {
    const payload = req.body
    const promises = Object.keys(payload).map(async (index) => {
        try {
            const { url, language } = payload[index]
            console.log(url, language)

            if (url && language) {
                return { index, score: await invokeRunner(url, language) }
            }
            return { index, score: 'URL invalid or language no supported' }
        } catch (e) {
            return { index, e }
        }
    })

    const response = await Promise.allSettled(promises)
        .then((values) => {
            return values.map((v) => ({
                index: v.value.index,
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
    return res.status(200).json(JSON.stringify(response))
}
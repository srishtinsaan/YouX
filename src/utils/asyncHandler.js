
// promise wala code :-

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export {asyncHandler}


// const asyncHandler = (func) => {}
// const asyncHandler = (func) => { return () => {}}
// const asyncHandler = (func) => () => {} ... remove outermost bracket



// async await wala code :-
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({ // we send this status in which we send error code also send json response
//             success : false,
//             message : error.message
//         })
//     }
// }





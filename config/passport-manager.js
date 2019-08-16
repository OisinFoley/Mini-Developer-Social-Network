class passportManager {

   authenticate(req, res, next){
          passport.authenticate('jwt', { session: false}, (err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired." });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            req.user = user;
            return next();
          })(req, res, next);
        };
   
  }
module.export = passportManager;

// module.export = {
//   authenticate(req, res, next) {
//     passport.authenticate('jwt', { session: false}, (err, user, info) => {
//       if (err) { return next(err); }
//       if (!user) {
//           if (info.name === "TokenExpiredError") {
//               return res.status(401).json({ message: "Your token has expired." });
//           } else {
//               return res.status(401).json({ message: info.message });
//           }
//       }
//       req.user = user;
//       return next();
//     })(req, res, next);
//   }
// }
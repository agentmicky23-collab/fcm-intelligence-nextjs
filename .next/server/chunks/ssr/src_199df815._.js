module.exports=[63454,a=>{"use strict";a.s(["ClientApp",()=>c,"ClientOnly",()=>d]);var b=a.i(11857);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call ClientApp() from the server but ClientApp is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/ClientOnly.tsx <module evaluation>","ClientApp"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call ClientOnly() from the server but ClientOnly is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/ClientOnly.tsx <module evaluation>","ClientOnly")},9988,a=>{"use strict";a.s(["ClientApp",()=>c,"ClientOnly",()=>d]);var b=a.i(11857);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call ClientApp() from the server but ClientApp is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/ClientOnly.tsx","ClientApp"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call ClientOnly() from the server but ClientOnly is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/ClientOnly.tsx","ClientOnly")},46220,a=>{"use strict";a.i(63454);var b=a.i(9988);a.n(b)},27572,a=>{"use strict";var b=a.i(7997),c=a.i(46220);let d=`
(function() {
  var origError = console.error;
  console.error = function() {
    var msg = arguments[0];
    if (typeof msg === 'string' && (msg.includes('#418') || msg.includes('#423') || msg.includes('#425') || msg.includes('Hydration'))) return;
    origError.apply(console, arguments);
  };
  window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes('#418') || e.message.includes('#423') || e.message.includes('#425') || e.message.includes('Hydration'))) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  }, true);
})();
`;function e({children:a}){return(0,b.jsxs)("html",{lang:"en",className:"dark",suppressHydrationWarning:!0,children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:d}}),(0,b.jsx)("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),(0,b.jsx)("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),(0,b.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",rel:"stylesheet"})]}),(0,b.jsx)("body",{suppressHydrationWarning:!0,children:(0,b.jsx)(c.ClientApp,{children:a})})]})}a.s(["default",()=>e,"metadata",0,{title:"FCM Intelligence",description:"40+ Post Offices. One Intelligence System.",openGraph:{title:"FCM Intelligence",description:"40+ Post Offices. One Intelligence System.",type:"website"},twitter:{card:"summary_large_image",title:"FCM Intelligence",description:"40+ Post Offices. One Intelligence System."}}])}];

//# sourceMappingURL=src_199df815._.js.map
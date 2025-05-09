"use strict";

// function isDevMode() {
//     return (typeof chrome.runtime.getManifest == "object");
//     return !('update_url' in chrome.runtime.getManifest());
// }

const isDevMode = (typeof chrome.runtime.getManifest !== "object");

// ====================================================================================== Misc
VK.addStyle(`
    @media only screen and (min-width: 1000px) {
        .varunagw-title-large {
            display: block;
        }
        .varunagw-title-small {
            display: none;
        }
    }
    @media only screen and (max-width: 999px) {
        .varunagw-title-large {
            display: none;
        }
        .varunagw-title-small {
            display: block;
        }
    }
`);

// ====================================================================================== Hide logo on top bar

VK.addStyle(`
    .app .header .logo {
        // display: none;
    }
`);


// ====================================================================================== Copy Symbol
$(document).on('click', '.vddl-list .instrument .symbol .nice-name', function (event) {
    if (event.altKey || !event.ctrlKey || !event.shiftKey) {
        return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();

    prompt("Copy it if you like!", $(event.target).text());
});


// ====================================================================================== Buy dialog

function getPrice() {
    let limitDom = $(this).closest(".order-window").find(".price input[type=number]");
    let price = 0;

    if (!limitDom.prop("disabled")) {
        price = limitDom.val();
    } else {
        let lastPriceDom = $(this).closest(".order-window").find(".last-price").last()
        price = lastPriceDom.text();
    }
    price = parseFloat(price.match(/[\d,\.]+/)[0].replace(/,/g, ""));
    return price;
}

function updateZerodhaField() {
    let $input = $(this).closest(".order-window").find(".quantity input");
    let inputLabel = $input.attr("label");
    let quantity = 0;

    if (inputLabel.indexOf("Qty") !== -1 || inputLabel.indexOf("Quantity") !== -1) {
        let price = getPrice.apply(this);
        quantity = Math.round($(this).closest(".order-window").find(".varunagw-amount-input").val() / price);
        let step = parseInt($(this).closest(".order-window").find(".quantity input").prop("step"));
        if (quantity % step !== 0) {
            let remainder = quantity % step;
            if (remainder <= step / 2) {
                quantity = quantity - remainder;
            } else {
                quantity = quantity + step - remainder;
            }
        }
    }
    if (inputLabel.indexOf("Amt") !== -1 || inputLabel.indexOf("Amount") !== -1) {
        quantity = $(this).closest(".order-window").find(".varunagw-amount-input").val()
    }

    $(this).closest(".order-window").find(".quantity input").val2(quantity);
}

function updateOurField() {
    let price = getPrice.apply(this);
    let $input = $(this).closest(".order-window").find(".quantity input");
    let inputLabel = $input.attr("label");
    let amount =0;
    if (inputLabel.indexOf("Qty") !== -1 || inputLabel.indexOf("Quantity") !== -1) {
        amount = parseInt($input.val() * price);
    }
    if (inputLabel.indexOf("Amt") !== -1 || inputLabel.indexOf("Amount") !== -1) {
        amount = parseInt($input.val());
    }
    $(this).closest(".order-window").find(".varunagw-amount-input").val(amount);
}

$(document).on("click", ".order-window .varunagw-amount-selector", function (e) {
    e.preventDefault();
    $(this).closest(".order-window").find(".varunagw-amount-input").val($(this).data("amount").toString().replace(/,/g, ""));
    updateZerodhaField.apply(this)
    updateOurField.apply(this);
});

$(document).on("input change", ".order-window .varunagw-amount-input", function () {
    updateZerodhaField.apply(this);
});


$(document).on("input change click submit", ".order-window .quantity input, .price input[type=number], .order-window button, .order-window [type=radio][name='exchange']", function (e) {
    if (e.originalEvent.isTrusted == true) {
        updateOurField.apply(this);
    }
});


VK.waitUntilMore(".order-window:not(:has(.varunagw-amount))", function () {
    $(this).find("footer").append($(`<br><div class="varunagw-amount" style="">
<label>Amount (₹): <input type="number" class="varunagw-amount-input" style="width: 100px;"></label><br>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="100">100</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="500">500</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="1000">1K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="2000">2K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="2500">2.5K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="5000">5K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="10,000">10K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="15,000">15K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="20,000">20K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="25,000">25K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="50,000">50K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="75,000">75K</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="1,00,000">1L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="1,50,000">1.5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="2,00,000">2L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="2,50,000">2.5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="3,00,000">3L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="3,50,000">3.5L</a></label>
<br>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="4,00,000">4L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="4,50,000">4.5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="5,00,000">5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="7,50,000">7.5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="10,00,000">10L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="12,50,000">12.5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="15,00,000">15L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="17,50,000">17.5L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="20,00,000">20L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="25,00,000">25L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="50,00,000">50L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="75,00,000">75L</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="1,00,00,000">1C</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="2,00,00,000">2C</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="5,00,00,000">5C</a></label>
<label>&nbsp;<a href="#" class="varunagw-amount-selector" data-amount="7,50,00,000">KBC</a></label>
</span>`));
    updateOurField.apply(this);
});

// ====================================================================================== Hide Squared-off

window.squaredOffVisibility = 0;
window.toggleSquaredOffVisibility = function (visiblity) {
    if (visiblity === undefined) {
        window.squaredOffVisibility = !window.squaredOffVisibility;
    } else {
        window.squaredOffVisibility = visiblity;
    }
    if (window.squaredOffVisibility) {
        VK.addStyle(".varunagw-hidden {visibility: collapse;}");
    } else {
        VK.addStyle(".varunagw-hidden {visibility: visible;}");
    }
}
window.toggleSquaredOffVisibility(window.squaredOffVisibility);

$(document).on("click", ".varunagw-checkbox", function () {
    window.toggleSquaredOffVisibility($(this).is(":checked"));
});

function addSquaredToolbar() {
    if ($(".data-table div.toolbar span.varunagw-toolbar").length == 0) {
        $(".data-table div.toolbar").prepend('<span class="varunagw-toolbar"><label><input type="checkbox" class="varunagw-checkbox">&nbsp;Hide Squared off&nbsp;</label></span>');
    }
    $(".varunagw-checkbox").prop("checked", window.squaredOffVisibility);
}

setInterval(function () {
    addSquaredToolbar();
    if (location.href == "https://kite.zerodha.com/holdings") {
        $("table tbody tr").each(function () {
            if ($(this).find("td:nth(1)").text().trim() == "0") {
                $(this).addClass("varunagw-hidden");
            } else {
                $(this).removeClass("varunagw-hidden");
            }
        });
    }

    if (location.href == "https://kite.zerodha.com/orders") {
        $("table tbody tr").each(function () {
            let $td = $(this).find("td.order-status");
            let text = $td.text().trim();
            let visible = ["REJECTED", "CANCELLED AMO"].indexOf(text) === -1;
            if (!visible) {
                $(this).addClass("varunagw-hidden");
            } else {
                $(this).removeClass("varunagw-hidden");
            }
        });
    }
    if (location.href == "https://kite.zerodha.com/positions") {
        $("table tbody tr").each(function () {
            if ($(this).find("td:nth(1)").hasClass("greyed")) {
                //if ($(this).find("td:nth(1)").text().trim() == "CNC") {
                $(this).addClass("varunagw-hidden");
            } else {
                $(this).removeClass("varunagw-hidden");
            }
        });

        $(".varunagw-checkbox").prop("checked", window.squaredOffVisibility);

    }
}, 500);


// ====================================================================================== GTT Link on top bar

$(document).on("click", ".varunagw-gtt-link", async function (e) {
    e.preventDefault();
    $("a[href='/orders']").click2();
    await VK.timeout(1);
    $(".page-nav a[href='/orders/gtt']").click2();
});

setInterval(function () {
    if ($(".app-nav .varunagw-gtt-link").length == 0) {
        $("<a href='/orders/gtt' class='varunagw-gtt-link'><span>GTT</span></a>").insertAfter($(".app-nav a[href='/dashboard']"));
    }

    if (VK.parseURL().pathname == "/orders/gtt") {
        $(".router-link-active:not(.varunagw-gtt-link)").removeClass("router-link-active");
        $(".varunagw-gtt-link").addClass("router-link-active");
    } else {
        $(".varunagw-gtt-link").removeClass("router-link-active");
    }
}, 500);

// ====================================================================================== Hide Quickwatch section

window.quickwatch_enabled = true;
$(document).on("click", ".varunagw-quickwatch-button", function (e) {
    e.preventDefault();
    window.quickwatch_enabled = !window.quickwatch_enabled;
    if (window.quickwatch_enabled) {
        $(this).find("span.varunagw-quickwatch-status").text("✔");
        $(".container-left").css("display", "block");
    } else {
        $(".container-left").css("display", "none");
        $(this).find("span.varunagw-quickwatch-status").text("✘");
    }
});

setInterval(function () {
    if ($(".app-nav .varunagw-quickwatch-button").length == 0) {
        $("<a href='#' class='varunagw-quickwatch-button'><span class='varunagw-title-large'>QuickWatch</span><span class='varunagw-title-small'>QW</span> &nbsp;<span class='varunagw-quickwatch-status'>✔</span></a>").insertBefore($(".app-nav a[href='/dashboard']"));
    }
}, 500);

// ====================================================================================== Zoom levels

window.zoomLevel = 1;
$(document).on("click", ".varunagw-zoom-button", function (e) {
    e.preventDefault();
    window.zoomLevel++;
    if (window.zoomLevel > 5) {
        window.zoomLevel = 1;
    }
    if (window.zoomLevel == 1) {
        // VK.addStyle(".marketwatch-sidebar .instruments .instrument .info {padding: 12px var(--padding-lr)}");
        VK.addStyle(".vddl-list.list-flat {zoom: 100%}");
    } else if (window.zoomLevel == 2) {
        // VK.addStyle(".marketwatch-sidebar .instruments .instrument .info {padding: 10px var(--padding-lr)}");
        VK.addStyle(".vddl-list.list-flat {zoom: 95%}");
    } else if (window.zoomLevel == 3) {
        // VK.addStyle(".marketwatch-sidebar .instruments .instrument .info {padding: 8px var(--padding-lr)}");
        VK.addStyle(".vddl-list.list-flat {zoom: 90%}");
    } else if (window.zoomLevel == 4) {
        // VK.addStyle(".marketwatch-sidebar .instruments .instrument .info {padding: 6.5px var(--padding-lr)}");
        VK.addStyle(".vddl-list.list-flat {zoom: 85%}");
    } else {
        // VK.addStyle(".marketwatch-sidebar .instruments .instrument .info {padding: 5px var(--padding-lr)}");
        VK.addStyle(".vddl-list.list-flat {zoom: 80%}");
    }
    $(this).find("span.varunagw-zoom-status").text(window.zoomLevel);
});

setInterval(function () {
    if ($(".app-nav .varunagw-zoom-button").length == 0) {
        $("<a href='#' class='varunagw-zoom-button'><span class='varunagw-title-large'>Zoom</span><span class='varunagw-title-small'>Zoom</span> &nbsp;<span class='varunagw-zoom-status'>1</span></a>").insertBefore($(".app-nav a[href='/dashboard']"));
    }
}, 500);


// ====================================================================================== Full width

$(function () {
    VK.addStyle(`
        .app .wrapper, .container {
            max-width: calc(100% - 150px);
        }
        .treemap {
            max-width: min-content;
        }
        [data-balloon] {
            position: static;
        }
        @media only screen and (min-width: 1500px) {
            .app .wrapper, .container {
                // max-width: 98%;
            }
        }
        .app .container .container-right {
           max-width: inherit;
        }
    `);

    setTimeout(function () {
        VK.addStyle(".bounce {right: 0px;}");
    }, 1);
});


// ====================================================================================== Hide annoying scroll area below charts
VK.waitUntilMore(".container-right .tvchart .instrument-market-data", function () {
    $(this).remove();
});
VK.waitUntilMore(".container-right .chart-wrapper .instrument-market-data", function () {
    $(this).remove();
});
setInterval(function () {
    $("#tv_chart_container").css("height", "calc(100vh - 64px)");
    $(".chart-wrapper .chart-container .chart-page iframe").css("height", "calc(100vh - 70px)");
}, 100);


// ====================================================================================== Wider watchlist
// if (isDevMode) {
//     VK.addStyle(`
//         .marketwatch-sidebar .marketwatch-selector {
//            width: 533px;
//         }
//         .marketwatch-sidebar .marketwatch-selector li.item {
//            padding: 10px 27px;
//         }
//         .marketwatch-sidebar .marketwatch-selector .settings {
//            padding: 10px 20px;
//         }
//     `);
//
//     setTimeout(function () {
//         let width1 = isDevMode ? 550 : 383;
//         let width2 = width1 + 1;
//         VK.addStyle(`.container-left {min-width: ${width1}px;}`);
//         VK.addStyle(`.marketwatch-sidebar {width: ${width1}px !important;}`);
//         VK.addStyle(`.header-left {min-width: ${width2}px;}`);
//     }, 1);
// }

// ====================================================================================== Market Depth
// if (isDevMode) {
//     window.depth_enabled = true;
//     $(document).on("click", ".varunagw-depth-button", function (e) {
//         e.preventDefault();
//         window.depth_enabled = !window.depth_enabled;
//         if (window.depth_enabled) {
//             $(this).find("span.varunagw-depth-status").text("✔");
//         } else {
//             $(this).find("span.varunagw-depth-status").text("✘");
//         }
//     });
//     setInterval(function () {
//         if ($(".app-nav .varunagw-depth-button").length == 0) {
//             $("<a href='#' class='varunagw-depth-button'><span class='varunagw-title-large'>Depth</span><span class='varunagw-title-small'>DPT</span> &nbsp;<span class='varunagw-depth-status'>✔</span></a>").insertBefore($(".app-nav a[href='/dashboard']"));
//         }
//     }, 500);
//
//     (async function () {
//         while (true) {
//             try {
//                 await VK.asyncDelay(500);
//                 if (!window.depth_enabled || document.hidden) {
//                     $(".varunagw-depth").css("display", "none");
//                     continue;
//                 } else {
//                     $(".varunagw-depth").css("display", "initial");
//                 }
//                 let instruments = [];
//                 $(".vddl-list .instrument").each(function () {
//                     let instrument =
//                         ($(this).find(".symbol .exchange").text() === "" ? "NSE" : $(this).find(".symbol .exchange").text())
//                         + ":" + $(this).find(".symbol .nice-name").text();
//
//                     instruments.push(instrument);
//                 });
//                 if (instruments.length === 0) {
//                     continue;
//                 }
//
//                 //let quotes = {"BSE:RELIANCE": 1};
//                 let quotes = await $.ajax({
//                     url: "https://trading.win/kite/quotesApi.php",
//                     method: "POST",
//                     data: {instruments: instruments},
//                 });
//                 $(".vddl-list .instrument").each(function (index) {
//                     let instrument =
//                         ($(this).find(".symbol .exchange").text() === "" ? "NSE" : $(this).find(".symbol .exchange").text())
//                         + ":" + $(this).find(".symbol .nice-name").text();
//
//                     let spread = "-";
//                     let colorSpread = "#A4A4A4"; // grey
//                     let depth1 = "-";
//                     let depthAmount1 = "";
//                     let color1 = "#4caf50"; // green
//                     let depth2 = "-";
//                     let depthAmount2 = "";
//                     let color2 = "#4caf50"; // green
//
//                     if (quotes[index] != null && quotes[index].original_instrument == instrument) {
//                         let quote = quotes[index];
//                         spread = (quote.spread === "-") ? "--" : Math.round(quote.spread * 100) / 100 + "%";
//                         colorSpread = (quote.spread > 0.1 || quote.spread === "-") ? "#df514c" : "#A4A4A4";
//
//                         if (quote.segment != "dOPT") {
//                             depth1 = quote.depth_ratio
//                             depthAmount1 = quote.depth_amount_display;
//                             if (depth1 < 1) {
//                                 color1 = "#df514c";
//                             }
//                             depth1 += "x";
//                             depth2 = quote.depth_ratio2;
//                             depthAmount2 = quote.depth_amount_display2;
//                             if (depth2 < 1) {
//                                 color2 = "#df514c";
//                             }
//                             depth2 += "x";
//                         }
//                     }
//
//                     if ($(this).find(".varunagw-depth").length === 0) {
//                         $(this).find(".price").children().first().css({"min-width": "52px"});
//                         $(this).find(".price").prepend(`
//                             <span class="varunagw-depth" style="min-width: 30px; padding-right: 4px;">
//                             <span class="dim varunagw-spread-ratio" style="min-widZth: 30px;"></span>
//                             <span style="min-width: 55px; displayZ: none;"><span class="dim varunagw-depth-ratio1"></span><span class="varunagw-depth-amount1 text-xxsmall"></span></span>
//                             <span style="min-width: 55px;"><span class="dim varunagw-depth-ratio2"></span><span class="varunagw-depth-amount2 text-xxsmall"></span></span>
//                             </span>
//                         `);
//                     }
//
//                     $(this).find(".varunagw-spread-ratio").css("color", colorSpread);
//                     $(this).find(".varunagw-spread-ratio").html2(spread);
//                     $(this).find(".varunagw-depth-ratio1").css("color", color2);
//                     $(this).find(".varunagw-depth-ratio1").html2(depth2);
//                     $(this).find(".varunagw-depth-amount1").html2("&nbsp;" + depthAmount2);
//                     $(this).find(".varunagw-depth-ratio2").css("color", color1);
//                     $(this).find(".varunagw-depth-ratio2").html2(depth1);
//                     $(this).find(".varunagw-depth-amount2").html2("&nbsp;" + depthAmount1);
//                 });
//
//                 //console.log(instruments);
//             } catch (e) {
//             }
//         }
//     })();
// }

// ====================================================================================== Hide Risk disclosures
(async () => {
    await VK.waitUntilExists("div.modal-header:contains(Risk disclosures on derivatives)");
    $(".modal-footer button:contains(I understand)").click();
})();

// ====================================================================================== Auto Login
// if (isDevMode) {
//     if ((VK.URL.href.startsWith("https://kite.zerodha.com/") && VK.URL.pathnow === "") || VK.URL.href.startsWith("https://kite.zerodha.com/connect/login?")) {
//         (async () => {
//             let creds = await $.get("https://trading.win/api/kite_login_creds.php");
//
//             await VK.waitUntilExists("input[type=password]");
//             $("input[type=text]").val2(creds.user);
//             $("input[type=password]").val2(creds.password);
//             $("button[type=submit]").click();
//
//             await VK.waitUntilExists(".twofa-value input");
//             $(".twofa-value input").val2(creds.topt);
//         })();
//     }
// }

// ====================================================================================== Copy Symbol / Quick Square Off
if (isDevMode) {
    $(document).on("click", ".varunagw-copy-link", async function (e) {
        e.preventDefault();
        let exchange = $(this).data("exchange");
        let symbol = $(this).data("symbol");
        let result = await $.get(`https://trading.win/kite/symbolInfo.php?fullSymbol=${exchange}:${symbol}`);
        VK.copyToClipboard(result.matchingSymbol);
    });
    $(document).on("click", ".varunagw-copy-text-link", function (e) {
        e.preventDefault();
        let exchange = $(this).data("exchange");
        let symbol = $(this).data("symbol");
        VK.copyToClipboard(symbol);
    });

    setInterval(function () {
        if (location.href == "https://kite.zerodha.com/orders/gtt") {
            $("table tbody tr").each(function () {
                let exchange = $(this).closest("tr").find("td.instrument .exchange").text().trim();
                let symbol = $(this).closest("tr").find("td.instrument .tradingsymbol").text().trim();

                let link = exchange + ":" + symbol
                    + ":" + (-1 * parseFloat($(this).find("td.quantity").text().trim()));
                link = "https://trading.win/kite/order.php?submit=1&orders[]=" + encodeURIComponent(link);

                if (isDevMode && 0) {
                    if ($(this).find("a.varunagw-exit-link").length == 0) {
                        $(this).find("td.instrument").prepend($("<a class='varunagw-exit-link' target='_blank'>x </a>"));
                        $(this).find("td.instrument").prepend($("<a class='varunagw-copy-text-link' target='_blank' href='#full-text'>⎘ </a>").data("exchange", exchange).data("symbol", symbol));
                        $(this).find("td.instrument").prepend($("<a class='varunagw-copy-link' target='_blank' href='#text'>⎘ </a>").data("exchange", exchange).data("symbol", symbol));
                    }
                    //$(this).find("a.varunagw-exit-link").attr("href", link);
                }
            });
        }

        $("table tbody tr").each(function () {
            let exchange = $(this).closest("tr").find("td.instrument .exchange").text().trim();
            let symbol = $(this).closest("tr").find("td.instrument .tradingsymbol").text().trim();

            let link = $(this).find("td.product").text().trim() + ":" + exchange + ":" + symbol
                + ":" + (-1 * parseFloat($(this).find("td.quantity").text().trim()));
            link = "https://trading.win/kite/order.php?submit=1&orders[]=" + encodeURIComponent(link);

            if (isDevMode && 0) {
                if ($(this).find("a.varunagw-exit-link").length == 0) {
                    $(this).find("td.instrument").prepend($("<a class='varunagw-exit-link' target='_blank'>x </a>"));
                    $(this).find("td.instrument").prepend($("<a class='varunagw-copy-text-link' target='_blank' href='#full-text'>⎘ </a>").data("exchange", exchange).data("symbol", symbol));
                    $(this).find("td.instrument").prepend($("<a class='varunagw-copy-link' target='_blank' href='#text'>⎘ </a>").data("exchange", exchange).data("symbol", symbol));
                }

                $(this).find("a.varunagw-exit-link").attr("href", link);
            }
        });
    }, 500);
}

// setInterval(function () {
//     let width = 90;
//     if ($(".container-right>.tvchart").length > 0) {
//         width = 100;
//     }
//     width = width + "%";
//     if ($(".container").css("max-width") != width) {
//         $(".app .wrapper, .container").css("max-width", width);
//         window.dispatchEvent(new Event('resize'));
//     }
//
// }, 100);

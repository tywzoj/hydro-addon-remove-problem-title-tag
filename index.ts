/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Context, Handler, ProblemDict } from "hydrooj";
import { _ } from "hydrooj";
import type { ContestDetailHandler } from "hydrooj/src/handler/contest";
import type { ProblemDetailHandler } from "hydrooj/src/handler/problem";

export function apply(ctx: Context) {
    ctx.on("handler/after/ProblemDetail", (handler: ProblemDetailHandler) => {
        if (handler.tdoc) {
            handler.pdoc.title = removeTitleTag(handler.pdoc.title);
        }
    });

    const pdictHandler = (handler: Handler) => {
        if (handler.response?.body?.pdict) {
            _.forEach(handler.response.body.pdict as ProblemDict, (pdoc) => {
                pdoc.title = removeTitleTag(pdoc.title);
            });
        }
    };
    ctx.on("handler/after/ContestProblemList#get", pdictHandler);
    ctx.on("handler/after/ContestScoreboard#get", pdictHandler);

    ctx.on("handler/after/ContestDetail", (handler: ContestDetailHandler) => {
        if (handler.response.body.overrideNav) {
            (handler.response.body.overrideNav as { name: string; displayName?: string }[]).forEach((item) => {
                if (item.name === "problem_detail" && item.displayName) {
                    item.displayName = removeTitleTag(item.displayName);
                }
            });
        }
    });
}

function removeTitleTag(s: string): string {
    return s.replace(/「[\S\s]+?」/, "").trim();
}

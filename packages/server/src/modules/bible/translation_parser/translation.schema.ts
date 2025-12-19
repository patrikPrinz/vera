import { z } from 'zod';

export const parsedXmlSchema = z.object({
  XMLBIBLE: z.object({
    INFORMATION: z.array(
      z.object({
        identifier: z.array(z.string()),
        language: z.array(z.string()),
        date: z.array(z.string()),
        creator: z.array(z.string()),
        source: z.array(z.string()),
      }),
    ),
    BIBLEBOOK: z.array(
      z.object({
        $: z.object({
          bnumber: z.string(),
          bname: z.string(),
          bsname: z.string(),
        }),
        CHAPTER: z.array(
          z.object({
            $: z.object({
              cnumber: z.string(),
            }),
            VERS: z.array(
              z.object({
                $: z.object({
                  vnumber: z.string(),
                }),
                _: z.string(),
              }),
            ),
          }),
        ),
      }),
    ),
  }),
});

import * as Context from '@effect/data/Context';
import { pipe } from '@effect/data/Function';
import * as Effect from '@effect/io/Effect';
import { type CliConfig } from '../config/types';
import { CliConfigTag } from '../config/tag';
import { createVersionsProgram } from '../create-program/versions';
import { createEnv } from '../env/create-env';
import type { DefaultEnv } from '../env/default-env';
import { EnvTag } from '../env/tags';
import { writeIfChanged } from '../env/write-if-changed';
import { createErrorHandlers } from '../error-handlers/create-error-handlers';
import { defaultErrorHandlers } from '../error-handlers/default-error-handlers';
import { getContext } from '../get-context';
import { promptEffects } from './effects';

export function prompt(cli: Partial<CliConfig>, env: DefaultEnv) {
  return pipe(
    getContext(),
    Effect.flatMap((ctx) => createVersionsProgram(ctx, promptEffects)),
    Effect.flatMap(writeIfChanged),
    Effect.catchTags(createErrorHandlers(defaultErrorHandlers)),
    Effect.provideContext(
      pipe(Context.empty(), Context.add(CliConfigTag, cli), Context.add(EnvTag, createEnv(env))),
    ),
  );
}

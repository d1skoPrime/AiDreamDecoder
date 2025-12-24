const dangerousPatterns = [
  /ignore instructions/i,
  /override (the )?prompt/i,
  /system prompt/i,
  /act as/i,
  /tell me/i,
  /hidden/i,
  /secret/i,
  /<script>/i,
  /\$\{.*\}/, // template injections
];

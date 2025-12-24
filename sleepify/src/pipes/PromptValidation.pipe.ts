import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DreamValidationPipe implements PipeTransform {
  dangerousPatterns = [
    /ignore (all|previous|earlier)? ?instructions/i,
    /disregard (the )?instructions/i,
    /bypass.*instructions/i,
    /override (the )?(system|previous|above)? ?prompt/i,
    /system prompt/i,
    /what is your prompt/i,
    /show.*prompt/i,
    /reveal.*prompt/i,
    /tell me the prompt/i,
    /tell me your rules/i,
    /print.*rules/i,
    /show.*rules/i,
    /leak.*prompt/i,
    /hidden.*prompt/i,
    /secret.*prompt/i,

    // Identity attacks
    /act as/i,
    /pretend to be/i,
    /you are now/i,
    /forget you are a/i,

    // AI override meta-commands
    /execute/i,
    /run this/i,
    /eval/i,
    /analyze this as system/i,
    /system:/i,
    /^###/i,
    /<system>/i,
    /<\/system>/i,

    // Code or scripting injection
    /<script>/i,
    /<\/script>/i,
    /javascript:/i,
    /onerror=/i,
    /\$\{.*\}/, // template injection
    /`.*`/, // backtick command blocks
    /\b(eval|exec|import)\b/i,

    // Attempt to get model to step out of role
    /ignore the above/i,
    /disobey/i,
    /do the opposite/i,
    /break.*rule/i,
    /jailbreak/i,
    /uncensored/i,

    // Trying to access system / developer messages
    /developer message/i,
    /system message/i,
    /initial prompt/i,
    /base prompt/i,
    /configuration/i,
    /open the system instructions/i,

    // Attempts wrapped inside "dream"
    /this is not a dream/i,
    /not a dream/i,
    /ignore the dream/i,

    // Trying to escape format
    /<\/?\w+>/, // HTML tags
    /<xml>/i,
    /<\/xml>/i,
    /<json>/i,
    /<\/json>/i,

    // Unicode obfuscation
    /𝚒𝚐𝚗𝚘𝚛𝚎/i,
    /𝗶𝗴𝗻𝗼𝗿𝗲/i,
    /ｉｇｎｏｒｅ/i,
    /𝒂𝒄𝒕 𝒂𝒔/i,
    /𝗮𝗰𝘁 𝗮𝘀/i,

    // Social engineering
    /for testing/i,
    /for research/i,
    /i am the developer/i,
    /debug mode/i,
    /dev mode/i,

    // Prompt misdirection
    /ignore your previous role/i,
    /stop pretending/i,
    /switch modes/i,

    // “Repeat after me…” attacks
    /repeat exactly/i,
    /say this exactly/i,
    /^repeat/i,
    /^say/i,
  ];

  transform(value: any) {
    if (typeof value.content === 'string') {
      for (const pattern of this.dangerousPatterns) {
        if (pattern.test(value.content)) {
          throw new BadRequestException(
            '❌ Only dreams can be analyzed. No other requests are accepted.',
          );
        }
      }
    }
    return value;
  }
}

package org.mindshell.test.api.tool.skills;

import lombok.extern.slf4j.Slf4j;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.tool.ToolCallback;
import java.util.List;

/**
 * Spring Ai Tool
 *
 * 2025/12/14 09:51
 */
@Slf4j
public class SpringAiToolTest {

    public static void main(String[] args) {
        if (args.length != 1 || args[0].isBlank()) {
            throw new IllegalArgumentException("Pass a local skills directory that you are authorized to use.");
        }

        OpenAiApi openAiApi = OpenAiApi.builder()
                .baseUrl(System.getenv("MINDSHELL_AI_BASE_URL"))
                .apiKey(System.getenv("MINDSHELL_AI_API_KEY"))
                .completionsPath("v1/chat/completions")
                .embeddingsPath("v1/embeddings")
                .build();

        ToolCallback skillTool = SkillsTool.builder()
                .addSkillsDirectory(args[0])
                .build();

        ChatModel chatModel = OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(OpenAiChatOptions.builder()
                        .model(System.getenv("MINDSHELL_AI_MODEL"))
                        .toolCallbacks(List.of(skillTool))
                        .build())
                .build();

        String call = chatModel.call("基于 skill 解答，电脑性能优化");

        log.info("测试结果:{}", call);
    }

}

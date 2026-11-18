package org.mindshell.domain.agent.service.armory.matter.mcp.client.factory;

import org.mindshell.domain.agent.model.valobj.AiAgentConfigTableVO;
import org.mindshell.domain.agent.service.armory.matter.mcp.client.TooMcpCreateService;
import org.mindshell.domain.agent.service.armory.matter.mcp.client.impl.LocalToolMcpCreateService;
import org.mindshell.domain.agent.service.armory.matter.mcp.client.impl.SSEToolMcpCreateService;
import org.mindshell.domain.agent.service.armory.matter.mcp.client.impl.StdioToolMcpCreateService;
import org.mindshell.types.enums.ResponseCode;
import org.mindshell.types.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Slf4j
@Service
public class DefaultMcpClientFactory {

    @Resource
    private LocalToolMcpCreateService localToolMcpCreateService;

    @Resource
    private SSEToolMcpCreateService sseToolMcpCreateService;

    @Resource
    private StdioToolMcpCreateService stdioToolMcpCreateService;

    public TooMcpCreateService getTooMcpCreateService(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp) {
        if (null != toolMcp.getLocal()) return localToolMcpCreateService;
        if (null != toolMcp.getSse()) return sseToolMcpCreateService;
        if (null != toolMcp.getStdio()) return stdioToolMcpCreateService;
        throw new AppException(ResponseCode.NOT_FOUND_METHOD.getCode(), ResponseCode.NOT_FOUND_METHOD.getInfo());
    }

}

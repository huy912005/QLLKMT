package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.respoonse.TinhResponse;
import com.Huy.WebBanHang.dto.respoonse.XaPhuongResponse;
import com.Huy.WebBanHang.mapper.DiaChiMapper;
import com.Huy.WebBanHang.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiaChiService {
    private final TinhRepository tinhRepository;
    private final XaPhuongRepository xaPhuongRepository;
    private final DiaChiMapper diaChiMapper;

    @Transactional(readOnly = true)
    public List<TinhResponse> layTatCaTinhThanh() {
        return tinhRepository.findAll().stream().map(diaChiMapper::toTinhResponse).collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<XaPhuongResponse> layXaPhuongTheoTinh(String idTinh) {
        return xaPhuongRepository.findByTinh_IdTinh(idTinh).stream().map(diaChiMapper::toXaPhuongResponse).collect(Collectors.toList());
    }
}